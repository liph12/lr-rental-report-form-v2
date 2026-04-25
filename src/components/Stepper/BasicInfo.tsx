import { useAppContext } from "../../providers/AppProvider";
import { Typography, Box } from "@mui/material";

export default function BasicInfo() {
  const { userData } = useAppContext();
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="h6" fontWeight="bold">
        {userData?.name}
      </Typography>
      <Typography color="textSecondary">{userData?.email}</Typography>
      <Typography color="textSecondary">{userData?.team}</Typography>
    </Box>
  );
}
