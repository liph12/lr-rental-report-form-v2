import { useEffect } from "react";
import { Box, Chip, Typography, Paper, Stack } from "@mui/material";

import { useAppContext } from "../../providers/AppProvider";
import axios from "axios";
import { type ReportForm as ReportFormType } from "../../providers/AppProvider";

interface Remittance {
  id: number;
  remittance: number;
  remittanceDate: string;
  remittanceMonth: string;
  remittanceDateAdded: string;
}

interface RentManager {
  id: number;
  name: string;
  email: string;
  remittances: Remittance[];
}

export interface DateCutOff {
  id: number;
  month_year: string;
  date: string;
}

type RMLabelType = "Rent Manager" | "Rent Manager PRO";

export default function ActiveRentManagers({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile, userData } = useAppContext();
  const rentManagerCount = reportForm.rent_managers.filter(
    (rm) => rm.type === "Rent Manager",
  ).length;

  const rentManagerProCount = reportForm.rent_managers.filter(
    (rm) => rm.type === "Rent Manager PRO",
  ).length;

  const isRequirementMet = rentManagerProCount >= 1 || rentManagerCount >= 5;
  const hasErrors = errors.length > 0;

  useEffect(() => {
    const fetchCutOffDates = async (): Promise<DateCutOff[]> => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://leuteriorealty.com/api/rental/sales-cutoff-dates`,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        return response.data;
      } catch {
        return [];
      }
    };

    const fetchRentManagersAsync = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://leuteriorealty.com/api/rental/team-rent-managers/${userData?.team_id}`,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );

        const cutOffDates: DateCutOff[] = await fetchCutOffDates();
        if (!cutOffDates?.length) return;

        const data = response.data.data;

        // Build cutoff lookup: month_year -> cutoff date string
        const cutOffMap: Record<string, string> = {};
        cutOffDates.forEach((c) => {
          cutOffMap[c.month_year] = c.date;
        });

        const RM_THRESHOLD = 5000;
        const RM_PRO_THRESHOLD = 50000;

        // Helper: remittance is valid for a month only if
        // remittanceMonth matches AND remittanceDateAdded <= cutoff date
        const isValidForMonth = (
          remittance: Remittance,
          month: string,
        ): boolean => {
          if (remittance.remittanceMonth !== month) return false;
          const cutOff = cutOffMap[month];
          if (!cutOff) return false;
          return remittance.remittanceDateAdded <= cutOff;
        };

        // Map raw API data to RentManager objects
        const mappedRms: RentManager[] = data.map((rm: any): RentManager => {
          const sales = rm.rentalSales.map(
            (s: any): Remittance => ({
              id: s.id,
              remittance: s.remittance,
              remittanceDate: s.remittanceDate,
              remittanceDateAdded: s.remittanceDateAdded,
              remittanceMonth: s.remittanceMonth,
            }),
          );
          return {
            id: rm.id,
            name: `${rm.firstName} ${rm.lastName}`,
            email: rm.email,
            remittances: sales,
          };
        });

        // --- Qualification Logic (JAN-MAR 2026) ---
        // JAN: fresh total. >= 50k = RM PRO, >= 5k = RM
        // FEB: cumulative (JAN + FEB). >= 50k = RM PRO, >= 5k = RM (if not yet qualified)
        // MAR: RESETS. only MAR totals. >= 50k = RM PRO, >= 5k = RM (if not yet qualified)

        type QualificationStatus = "Rent Manager PRO" | "Rent Manager" | null;

        interface QualifiedAgent {
          rm: RentManager;
          status: QualificationStatus;
          certifiedAt: string;
        }

        const qualifiedAgents: QualifiedAgent[] = [];

        for (const rm of mappedRms) {
          let bestStatus: QualificationStatus = null;
          let certifiedAt = "";

          // JAN totals
          const janTotal = rm.remittances
            .filter((r) => isValidForMonth(r, "2026-01"))
            .reduce((sum, r) => sum + r.remittance, 0);

          // FEB totals — cumulative with JAN
          const febTotal = rm.remittances
            .filter((r) => isValidForMonth(r, "2026-02"))
            .reduce((sum, r) => sum + r.remittance, 0);
          const cumFeb = janTotal + febTotal;

          // MAR totals — resets, standalone
          const marTotal = rm.remittances
            .filter((r) => isValidForMonth(r, "2026-03"))
            .reduce((sum, r) => sum + r.remittance, 0);

          // Evaluate JAN
          if (janTotal >= RM_PRO_THRESHOLD) {
            bestStatus = "Rent Manager PRO";
            certifiedAt = "January 2026";
          } else if (janTotal >= RM_THRESHOLD) {
            bestStatus = "Rent Manager";
            certifiedAt = "January 2026";
          }

          // Evaluate FEB (cumulative) — only upgrade, never downgrade
          if (bestStatus !== "Rent Manager PRO") {
            if (cumFeb >= RM_PRO_THRESHOLD) {
              bestStatus = "Rent Manager PRO";
              certifiedAt = "February 2026";
            } else if (cumFeb >= RM_THRESHOLD && bestStatus === null) {
              bestStatus = "Rent Manager";
              certifiedAt = "February 2026";
            }
          }

          // Evaluate MAR — resets independently
          if (marTotal >= RM_PRO_THRESHOLD) {
            if (bestStatus !== "Rent Manager PRO") {
              bestStatus = "Rent Manager PRO";
              certifiedAt = "March 2026";
            }
          } else if (marTotal >= RM_THRESHOLD) {
            if (bestStatus === null) {
              bestStatus = "Rent Manager";
              certifiedAt = "March 2026";
            }
          }

          if (bestStatus !== null) {
            qualifiedAgents.push({ rm, status: bestStatus, certifiedAt });
          }
        }

        // --- Store Logic ---
        // If any RM PRO exists → store only 1 RM PRO
        // Otherwise → store all qualified RMs
        const rmProAgents = qualifiedAgents.filter(
          (a) => a.status === "Rent Manager PRO",
        );
        const rmAgents = qualifiedAgents.filter(
          (a) => a.status === "Rent Manager",
        );

        let finalList: ReportFormType["rent_managers"] = [];

        if (rmProAgents.length > 0) {
          const top = rmProAgents[0];
          finalList = [
            {
              id: top.rm.id,
              name: top.rm.name,
              type: "Rent Manager PRO" as RMLabelType,
              certifiedAt: top.certifiedAt,
            },
          ];
        } else {
          finalList = rmAgents.map((a) => ({
            id: a.rm.id,
            name: a.rm.name,
            type: "Rent Manager" as RMLabelType,
            certifiedAt: a.certifiedAt,
          }));
        }

        setReportForm((prev) => ({
          ...prev,
          rent_managers: finalList,
        }));
      } catch (e) {
        // handle error
      }
    };

    if (userData) {
      fetchRentManagersAsync();
    }
  }, [userData]);

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        mt: 2,
        border: hasErrors ? "1px solid #eb7373" : "1px solid #ccc",
      }}
      elevation={0}
    >
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label="01" color="warning" />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
          Maintain Active Rent Managers
        </Typography>
      </Stack>

      <Typography sx={{ mt: 1, fontSize: { xs: 13, sm: 14 } }}>
        Minimum of 5 Rent Managers OR 1 Rent Manager PRO as of{" "}
        <b>(January - March 2026).</b>
      </Typography>

      {/* Status */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          RM: {rentManagerCount} • PRO: {rentManagerProCount}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: isRequirementMet ? "success.main" : "error.main",
            fontWeight: 500,
          }}
        >
          {isRequirementMet ? "Requirement met" : "Need 5 RM or 1 RM PRO"}
        </Typography>
      </Box>

      {/* List */}
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {reportForm.rent_managers.map((rm, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 1,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography fontWeight={600} fontSize={14}>
                {rm.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {rm.type} • {rm.certifiedAt}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {hasErrors && (
        <Box sx={{ mt: 1 }}>
          {errors.map((err, k) => (
            <Typography key={k} variant="body2" color="error" sx={{ mb: 0.5 }}>
              {err}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}
