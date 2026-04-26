import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../../providers/AppProvider";
import AppButton from "../utils/AppButton";
import { AttachFile } from "@mui/icons-material";
import useUploadFiles from "../hooks/useUploadFiles";

type Uploading = {
  office_progress_upload: boolean;
  secretarial_documents_progress_upload: boolean;
};

export default function OfficeAndSecretary({ errors }: { errors: string[] }) {
  const { isMobile, reportForm, setReportForm } = useAppContext();

  const [secName, setSecName] = useState("");
  const [secEmail, setSecEmail] = useState("");
  const [uploading, setUploading] = useState<Uploading>({
    office_progress_upload: false,
    secretarial_documents_progress_upload: false,
  });

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

  const handleOfficePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading((prev) => ({ ...prev, office_progress_upload: true }));

    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);

    setUploading((prev) => ({ ...prev, office_progress_upload: false }));

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
  const handleDocuments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading((prev) => ({
      ...prev,
      secretarial_documents_progress_upload: true,
    }));

    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);

    setUploading((prev) => ({
      ...prev,
      secretarial_documents_progress_upload: false,
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
          {uploading.office_progress_upload && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="warning">
                Uploading photos...
              </Typography>
            </Box>
          )}
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
          {uploading.secretarial_documents_progress_upload && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="warning">
                Uploading documents...
              </Typography>
            </Box>
          )}
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
