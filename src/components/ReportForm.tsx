import { useState } from "react";
import { Box, Typography, Chip, Divider, Button, Alert } from "@mui/material";
import { FavoriteRounded, WarningAmberOutlined } from "@mui/icons-material";
import AppLayout from "./AppLayout";
import BasicInfo from "./Stepper/BasicInfo";
import ActiveRentManagers from "./Stepper/ActiveRentManagers";
import OfficeAndSecretary from "./Stepper/OfficeAndSecretary";
import ParticipatedActivity from "./Stepper/ParticipatedActivity";
import SocialMediaPresence from "./Stepper/SocialMediaPresence";
import RentPhAccount from "./Stepper/RentPhAccount";
import axios from "axios";

const MONTHS = ["January", "February", "March"];

export default function ReportForm() {
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (m: string) => setErrors((prev) => [...prev, m]);

  const handleSubmitForm = async () => {
    setErrors([]);
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
          <ActiveRentManagers />
          <OfficeAndSecretary />
          <ParticipatedActivity />
          <SocialMediaPresence />
          <RentPhAccount />
        </Box>
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography>
            Thank you for completing this form. <br /> Your active response and
            participation is grealty appreciated!
          </Typography>
          <FavoriteRounded color="primary" />
          <FavoriteRounded color="warning" />
        </Box>
        <Box sx={{ mt: 1, mb: 2 }}>
          {errors.map((err, i) => (
            <Alert key={i} severity="error">
              {err}
            </Alert>
          ))}
        </Box>
        <Button
          fullWidth
          disableElevation
          variant="contained"
          sx={{ borderRadius: 20, textTransform: "none" }}
          onClick={handleSubmitForm}
        >
          Submit Report
        </Button>
      </Box>
    </AppLayout>
  );
}
