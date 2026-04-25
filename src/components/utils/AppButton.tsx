import { Button, type ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  textTransform: "none",
  borderRadius: 20,
  fontWeight: 500,
});

type AppButtonProps = ButtonProps & {
  loading?: boolean;
};

export default function AppButton({
  children,
  loading = false,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <StyledButton
      disabled={loading || disabled}
      {...props}
      disableElevation
      size="small"
    >
      {loading ? "loading..." : children}
    </StyledButton>
  );
}
