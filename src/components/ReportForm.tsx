import { useState } from "react";
import { Box, Typography, Chip, Divider, Button, Alert } from "@mui/material";
import { FavoriteRounded, WarningAmberOutlined } from "@mui/icons-material";
import { useAppContext } from "../providers/AppProvider";
import AppLayout from "./AppLayout";
import BasicInfo from "./Stepper/BasicInfo";
import ActiveRentManagers from "./Stepper/ActiveRentManagers";
import OfficeAndSecretary from "./Stepper/OfficeAndSecretary";
import ParticipatedActivity from "./Stepper/ParticipatedActivity";
import SocialMediaPresence from "./Stepper/SocialMediaPresence";
import RentPhAccount from "./Stepper/RentPhAccount";
import axios, { AxiosError } from "axios";

const MONTHS = ["January", "February", "March"];

type Errors = {
  label: string;
  errors: string[];
};

export default function ReportForm() {
  const authToken = localStorage.getItem("authToken");
  const { reportForm, userData } = useAppContext();
  const [errors, setErrors] = useState<Errors[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitForm = async () => {
    try {
      setSubmitting(true);
      const payLoad = { ...reportForm, member_id: userData?.id };
      const response = await axios.post(
        "https://api.leuteriorealty.com/lr/v2/public/api/store-rental-report",
        payLoad,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
    } catch (e) {
      const err = e as AxiosError;
      if (err.status === 403) {
        if (err.response) {
          const errors = err.response.data as Errors[];

          setErrors(errors);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <Box
        sx={{
          padding: 4,
          borderRadius: 5,
          border: "1px solid #ccc",
        }}
      >
        <Box>
          <Chip label="MONTHLY REPORT FORM" size="small" color="primary" />
          <Box sx={{ mt: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Rental Report Requirements
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography component="p" variant="body2">
              This rent.ph form collects, verifies and documents monthly reports
              from <b>Team Leaders</b> and <b>Unit Managers</b>. All submitted
              information is used for monitoring performance, tracking progress,
              and ensuring accurate record-keeping.
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <WarningAmberOutlined color="warning" />
            <Typography color="textSecondary" variant="body2">
              Important Note: Kindly ensure that all submitted information is
              accurate and up to date.
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <BasicInfo />
          <ActiveRentManagers
            errors={errors.find((e) => e.label === "01")?.errors ?? []}
          />
          <OfficeAndSecretary
            errors={errors.find((e) => e.label === "02")?.errors ?? []}
          />
          <ParticipatedActivity
            errors={errors.find((e) => e.label === "03")?.errors ?? []}
          />
          <SocialMediaPresence
            errors={errors.find((e) => e.label === "04")?.errors ?? []}
          />
          <RentPhAccount
            errors={errors.find((e) => e.label === "05")?.errors ?? []}
          />
        </Box>
        {/* <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography>
            Thank you for completing this form. <br /> Your active response and
            participation is grealty appreciated!
          </Typography>
          <FavoriteRounded color="primary" />
          <FavoriteRounded color="warning" />
        </Box> */}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ my: 2 }}>
            Form has required fields, please review them and resubmit.
          </Alert>
        )}
        <Button
          fullWidth
          disableElevation
          variant="contained"
          sx={{ borderRadius: 20, textTransform: "none" }}
          onClick={handleSubmitForm}
          loading={submitting}
        >
          Submit Report
        </Button>
      </Box>
    </AppLayout>
  );
}
