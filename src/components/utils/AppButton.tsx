import { Button, type ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  textTransform: "none",
  borderRadius: 20,
  fontWeight: 500,
});

export default function AppButton({ children, ...props }: ButtonProps) {
  return (
    <StyledButton {...props} disableElevation size="small">
      {children}
    </StyledButton>
  );
}
