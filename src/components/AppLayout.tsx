import { type ReactNode } from "react";
import { Box, Container } from "@mui/material";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 5 }}>{children}</Box>
    </Container>
  );
}
