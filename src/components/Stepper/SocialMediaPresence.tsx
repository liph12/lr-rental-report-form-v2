import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../../providers/AppProvider";
import AppButton from "../utils/AppButton";
import { AttachFile } from "@mui/icons-material";
import useUploadFiles from "../hooks/useUploadFiles";

const MONTHS = ["January", "February", "March"];

type MonthlyUploading = {
  month: string;
  progress: boolean;
};

export default function SocialMediaPresence({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  const data = reportForm.social_media_presence;

  const [month, setMonth] = useState("January");
  const [date, setDate] = useState("");
  const [monthlyUploadings, setMonthlyUploadings] = useState<
    MonthlyUploading[]
  >([]);

  // ─────────────────────────────────────────────
  // ADD ENTRY
  // ─────────────────────────────────────────────
  const addEntry = () => {
    if (!date) return;

    setReportForm((prev) => ({
      ...prev,
      social_media_presence: [
        ...prev.social_media_presence,
        {
          month,
          date,
          documents: [],
        },
      ],
    }));
    setMonthlyUploadings((prev) => [...prev, { month, progress: false }]);

    setDate("");
  };

  // ─────────────────────────────────────────────
  // REMOVE ENTRY
  // ─────────────────────────────────────────────
  const removeEntry = (index: number) => {
    setReportForm((prev) => ({
      ...prev,
      social_media_presence: prev.social_media_presence.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const makeUploadProgress = (
    activityIndex: number,
    progress: boolean = true,
  ) => {
    setMonthlyUploadings((prev) => {
      const updated = [...prev];

      updated[activityIndex] = {
        ...updated[activityIndex],
        progress: progress,
      };

      return updated;
    });
  };

  // ─────────────────────────────────────────────
  // UPLOAD DOCUMENTS
  // ─────────────────────────────────────────────
  const uploadDocs = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    makeUploadProgress(index);

    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);

    makeUploadProgress(index, false);

    setReportForm((prev) => {
      const updated = [...prev.social_media_presence];

      updated[index] = {
        ...updated[index],
        documents: [...updated[index].documents, ...urls],
      };

      return {
        ...prev,
        social_media_presence: updated,
      };
    });
  };

  // ─────────────────────────────────────────────
  // REMOVE DOCUMENT
  // ─────────────────────────────────────────────
  const removeDocument = (entryIndex: number, docIndex: number) => {
    setReportForm((prev) => {
      const updated = [...prev.social_media_presence];

      updated[entryIndex] = {
        ...updated[entryIndex],
        documents: updated[entryIndex].documents.filter(
          (_, i) => i !== docIndex,
        ),
      };

      return {
        ...prev,
        social_media_presence: updated,
      };
    });
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
        <Chip label="04" color="warning" />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
          Strengthen Rent.ph and Rent.ph Cares Social Media Presence
        </Typography>
      </Stack>

      <Typography sx={{ mt: 1, fontSize: { xs: 13, sm: 14 } }}>
        Minimum 5 social media activities per month required (Jan–Mar).
      </Typography>
      <Typography sx={{ fontSize: { xs: 12, sm: 13 } }} color="textSecondary">
        Note: Kindly upload a screenshot or relevant proof to verify each social
        media activity. Please indicate the Date of posting.
      </Typography>

      {/* FORM */}
      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: 2 }}>
        {/* MONTH */}
        <TextField
          select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          size="small"
          fullWidth
        >
          {MONTHS.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>

        {/* DATE */}
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          fullWidth
        />

        <AppButton onClick={addEntry} variant="contained">
          Add
        </AppButton>
      </Stack>

      {/* GROUPED MONTHS */}
      <Stack spacing={4} sx={{ mt: 4 }}>
        {MONTHS.map((m) => {
          const items = data.filter((a) => a.month === m);

          return (
            <Box key={m}>
              {/* MONTH HEADER */}
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                {m}
              </Typography>

              {items.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No entries yet
                </Typography>
              )}

              <Stack spacing={2}>
                {items.map((entry) => {
                  const entryIndex = data.findIndex(
                    (x) => x.month === entry.month && x.date === entry.date,
                  );

                  return (
                    <Paper
                      key={entryIndex}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2 }}
                    >
                      {/* HEADER */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            Social Media Activity
                          </Typography>
                          <Typography variant="caption">
                            {entry.date}
                          </Typography>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => removeEntry(entryIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* UPLOAD */}
                      <AppButton
                        component="label"
                        size="small"
                        sx={{ mt: 1 }}
                        startIcon={<AttachFile />}
                      >
                        Upload Proof
                        <input
                          hidden
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => uploadDocs(e, entryIndex)}
                        />
                      </AppButton>

                      {/* PREVIEW */}
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}
                      >
                        {entry.documents.map((doc, docIndex) => (
                          <Box key={docIndex} sx={{ position: "relative" }}>
                            <Box
                              component="img"
                              src={doc}
                              sx={{
                                width: 70,
                                height: 70,
                                borderRadius: 1,
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                            />

                            {/* REMOVE DOCUMENT */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                removeDocument(entryIndex, docIndex)
                              }
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                background: "white",
                                border: "1px solid #ddd",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                      {monthlyUploadings[entryIndex].progress && (
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <CircularProgress size={20} />
                          <Typography variant="body2" color="warning">
                            Uploading documents...
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>
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
