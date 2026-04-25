import { Box, Typography, Chip, Divider } from "@mui/material";
import { WarningAmberOutlined } from "@mui/icons-material";
import AppLayout from "./AppLayout";
import BasicInfo from "./Stepper/BasicInfo";
import ActiveRentManagers from "./Stepper/ActiveRentManagers";
import OfficeAndSecretary from "./Stepper/OfficeAndSecretary";

export default function ReportForm() {
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
              Rental Report
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              Requirements
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography component="p">
              This rent.ph form collects, verifies and documents monthly reports
              from <b>Team Leaders</b> and <b>Unit Managers</b>. All submitted
              information is used for monitoring performance, tracking progress,
              and ensuring accurate record-keeping.
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
            <WarningAmberOutlined />
            <Typography>
              Important Note: Kindly ensure that all submitted information is
              accurate and up to date.
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <BasicInfo />
        <ActiveRentManagers />
        <OfficeAndSecretary />
      </Box>
    </AppLayout>
  );
}
