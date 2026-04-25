import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../../providers/AppProvider";
import AppButton from "../utils/AppButton";
import { AttachFile } from "@mui/icons-material";

export default function OfficeAndSecretary() {
  const { isMobile, reportForm, setReportForm } = useAppContext();

  const [secName, setSecName] = useState("");
  const [secEmail, setSecEmail] = useState("");

  const data = reportForm.office_secretary;

  // ─────────────────────────────────────────────
  // AUTO UPDATE ADDRESS
  // ─────────────────────────────────────────────
  const handleAddressChange = (value: string) => {
    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        address: value,
      },
    }));
  };

  // ─────────────────────────────────────────────
  // SECRETARY CRUD
  // ─────────────────────────────────────────────
  const addSecretary = () => {
    if (!secName || !secEmail) return;

    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        secretaries: [
          ...prev.office_secretary.secretaries,
          { name: secName, email: secEmail },
        ],
      },
    }));

    setSecName("");
    setSecEmail("");
  };

  const removeSecretary = (index: number) => {
    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        secretaries: prev.office_secretary.secretaries.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  // ─────────────────────────────────────────────
  // IMAGE UPLOAD HELPERS
  // ─────────────────────────────────────────────
  const handleOfficePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        office_photos: [...prev.office_secretary.office_photos, ...urls],
      },
    }));
  };

  const handleDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        secretarial_documents: [
          ...prev.office_secretary.secretarial_documents,
          ...urls,
        ],
      },
    }));
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        mt: 2,
        border: "1px solid #e0e0e0",
      }}
      elevation={0}
    >
      {/* HEADER */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label="02" color="warning" />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
          Office & Secretary Requirements
        </Typography>
      </Stack>

      <Typography sx={{ mt: 1, fontSize: { xs: 13, sm: 14 } }}>
        Upload office photos, documents, and manage secretaries.
      </Typography>

      {/* ADDRESS (AUTO SAVE) */}
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Office Address"
          value={data.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          size="small"
          fullWidth
        />
      </Box>

      {/* IMAGES */}
      <Stack direction={isMobile ? "column" : "row"} spacing={3} sx={{ mt: 3 }}>
        {/* OFFICE PHOTOS */}
        <Box>
          <Typography fontWeight={600}>Office Photos</Typography>

          <AppButton
            component="label"
            sx={{ mt: 1 }}
            startIcon={<AttachFile />}
          >
            Upload Photos
            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleOfficePhotos}
            />
          </AppButton>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {data.office_photos.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* DOCUMENTS */}
        <Box>
          <Typography fontWeight={600}>
            Employee Contact Info / Agreement
          </Typography>

          <AppButton
            component="label"
            sx={{ mt: 1 }}
            startIcon={<AttachFile />}
          >
            Upload Documents
            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleDocuments}
            />
          </AppButton>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {data.secretarial_documents.map((doc, i) => (
              <Box
                key={i}
                component="img"
                src={doc}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* SECRETARY LIST */}
      <Box sx={{ mt: 3 }}>
        <Typography fontWeight={600}>Secretaries</Typography>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          sx={{ mt: 1 }}
        >
          <TextField
            label="Name"
            value={secName}
            onChange={(e) => setSecName(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="Email"
            value={secEmail}
            onChange={(e) => setSecEmail(e.target.value)}
            size="small"
            fullWidth
          />

          <AppButton onClick={addSecretary} variant="contained">
            Add
          </AppButton>
        </Stack>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {data.secretaries.map((sec, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                border: "1px solid #eee",
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{sec.name}</Typography>
                <Typography variant="caption">{sec.email}</Typography>
              </Box>

              <IconButton color="error" onClick={() => removeSecretary(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
