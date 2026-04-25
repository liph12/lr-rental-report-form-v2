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
import useUploadFiles from "../hooks/useUploadFiles";

type Files = {
  office_photos: File[];
  secretarial_documents: File[];
};

export default function OfficeAndSecretary() {
  const { isMobile, reportForm, setReportForm } = useAppContext();

  const [secName, setSecName] = useState("");
  const [secEmail, setSecEmail] = useState("");
  const [files, setFiles] = useState<Files>({
    office_photos: [],
    secretarial_documents: [],
  });
  const [progress, setProgress] = useState(false);

  const data = reportForm.office_secretary;

  // ─────────────────────────────────────────────
  // ADDRESS (AUTO SAVE)
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

  // ─────────────────────────────────────────────
  // REMOVE SECRETARY
  // ─────────────────────────────────────────────
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
  // OFFICE PHOTOS UPLOAD
  // ─────────────────────────────────────────────

  const handleOfficePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    setFiles((prev) => ({
      ...prev,
      office_photos: [...prev.office_photos, ...files],
    }));
    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        office_photos: [...prev.office_secretary.office_photos, ...urls],
      },
    }));
  };

  // ─────────────────────────────────────────────
  // REMOVE OFFICE PHOTO
  // ─────────────────────────────────────────────
  const removeOfficePhoto = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      office_photos: prev.office_photos.filter((_, i) => i !== index),
    }));
    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        office_photos: prev.office_secretary.office_photos.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  // ─────────────────────────────────────────────
  // DOCUMENTS UPLOAD
  // ─────────────────────────────────────────────
  const handleDocuments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    setFiles((prev) => ({
      ...prev,
      secretarial_documents: [...prev.secretarial_documents, ...files],
    }));

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

  // ─────────────────────────────────────────────
  // REMOVE DOCUMENT
  // ─────────────────────────────────────────────
  const removeDocument = (index: number) => {
    setFiles((prev) => ({
      ...prev,
      secretarial_documents: prev.secretarial_documents.filter(
        (_, i) => i !== index,
      ),
    }));
    setReportForm((prev) => ({
      ...prev,
      office_secretary: {
        ...prev.office_secretary,
        secretarial_documents:
          prev.office_secretary.secretarial_documents.filter(
            (_, i) => i !== index,
          ),
      },
    }));
  };

  const handleSaveOfficePhotosAsync = async () => {
    setProgress(true);
    const uploadedFiles = await useUploadFiles(files.office_photos);

    console.log(uploadedFiles);

    setProgress(false);
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

      {/* ADDRESS */}
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
              <Box key={i} sx={{ position: "relative" }}>
                <Box
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

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeOfficePhoto(i)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    border: "1px solid #ddd",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
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
              <Box key={i} sx={{ position: "relative" }}>
                <Box
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

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeDocument(i)}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    border: "1px solid #ddd",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <AppButton
          onClick={handleSaveOfficePhotosAsync}
          variant="contained"
          loading={progress}
        >
          Save Files
        </AppButton>
      </Box>

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
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography fontWeight={600}>{sec.name}</Typography>
                  <Typography variant="caption">{sec.email}</Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeSecretary(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
