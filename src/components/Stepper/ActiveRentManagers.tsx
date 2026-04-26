import { useState } from "react";
import {
  Box,
  Chip,
  Typography,
  TextField,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../../providers/AppProvider";
import AppButton from "../utils/AppButton";

type RMLabelType = "Rent Manager" | "Rent Manager PRO";

export default function ActiveRentManagers({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  const [selectedType, setSelectedType] = useState<RMLabelType>("Rent Manager");
  const [name, setName] = useState("");
  const [certifiedAt, setCertifiedAt] = useState("");

  // ── Add ─────────────────────────────
  const addRentManager = () => {
    if (!name || !certifiedAt) return;

    setReportForm((prev) => ({
      ...prev,
      rent_managers: [
        ...prev.rent_managers,
        { name, certifiedAt, type: selectedType },
      ],
    }));

    setName("");
    setCertifiedAt("");
  };

  // ── Remove ─────────────────────────────
  const removeRentManager = (index: number) => {
    setReportForm((prev) => ({
      ...prev,
      rent_managers: prev.rent_managers.filter((_, i) => i !== index),
    }));
  };

  // ── Counts ─────────────────────────────
  const rentManagerCount = reportForm.rent_managers.filter(
    (rm) => rm.type === "Rent Manager",
  ).length;

  const rentManagerProCount = reportForm.rent_managers.filter(
    (rm) => rm.type === "Rent Manager PRO",
  ).length;

  const isRequirementMet = rentManagerProCount >= 1 || rentManagerCount >= 5;

  const canAdd =
    selectedType === "Rent Manager PRO"
      ? rentManagerProCount < 1
      : rentManagerCount < 5;

  const hasErrors = errors.length > 0;

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
        Minimum of 5 Rent Managers OR 1 Rent Manager PRO per quarter.
      </Typography>

      {/* Toggle */}
      <ToggleButtonGroup
        exclusive
        value={selectedType}
        onChange={(_, val) => val && setSelectedType(val)}
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <ToggleButton value="Rent Manager" size="small">
          Rent Manager
        </ToggleButton>
        <ToggleButton value="Rent Manager PRO" size="small">
          RM PRO
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Inputs */}
      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          type="date"
          label="Certified At"
          InputLabelProps={{ shrink: true }}
          value={certifiedAt}
          onChange={(e) => setCertifiedAt(e.target.value)}
          size="small"
          fullWidth
        />

        <AppButton
          variant="contained"
          onClick={addRentManager}
          disabled={!canAdd || !name || !certifiedAt}
          sx={{
            width: isMobile ? "100%" : "auto",
            whiteSpace: "nowrap",
          }}
        >
          Add
        </AppButton>
      </Stack>

      {/* Status */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          RM: {rentManagerCount}/5 • PRO: {rentManagerProCount}
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

            <IconButton
              size="small"
              color="error"
              onClick={() => removeRentManager(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
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
