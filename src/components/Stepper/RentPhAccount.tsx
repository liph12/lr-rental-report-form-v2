import { Box, Typography, Stack, Paper, Chip, TextField } from "@mui/material";
import { useAppContext } from "../../providers/AppProvider";

export default function RentPhAccount({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

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
