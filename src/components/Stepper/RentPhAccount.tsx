import { Box, Typography, Stack, Paper, Chip, TextField } from "@mui/material";
import { useAppContext } from "../../providers/AppProvider";

export default function RentPhAccount() {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        mt: 2,
        border: "1px solid #ccc",
      }}
      elevation={0}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label="05" color="warning" />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
          Active Rent.ph Account
        </Typography>
      </Stack>

      <Typography sx={{ mt: 1, fontSize: { xs: 13, sm: 14 } }}>
        Please provide the direct link to your active Rent.ph account for
        verification purposes.
      </Typography>

      <Box sx={{ mt: 2 }}>
        <TextField
          label="Rent.ph account link"
          value={reportForm.rent_ph_account}
          onChange={(e) =>
            setReportForm((prev) => ({
              ...prev,
              rent_ph_account: e.target.value,
            }))
          }
          size="small"
          fullWidth
        />
      </Box>
    </Paper>
  );
}
