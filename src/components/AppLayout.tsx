import { type ReactNode } from "react";
import { Box, Container } from "@mui/material";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Box>{children}</Box>
    </Container>
  );
}
