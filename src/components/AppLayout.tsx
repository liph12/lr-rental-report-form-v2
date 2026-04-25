import { type ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { AppProvider } from "../providers/AppProvider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Container maxWidth="md">
        <Box sx={{ my: 5 }}>{children}</Box>
      </Container>
    </AppProvider>
  );
}
