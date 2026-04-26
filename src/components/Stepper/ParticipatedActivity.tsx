import { useState } from "react";
import {
  Paper,
  Box,
  Chip,
  Typography,
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

export default function ParticipatedActivity({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  const data = reportForm.participated_activities;

  const [month, setMonth] = useState("January");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyUploadings, setMonthlyUploadings] = useState<
    MonthlyUploading[]
  >([]);

  // ─────────────────────────────────────────────
  // ADD ACTIVITY
  // ─────────────────────────────────────────────
  const addActivity = () => {
    if (!title || !description || !date) return;

    setReportForm((prev) => ({
      ...prev,
      participated_activities: [
        ...prev.participated_activities,
        {
          month,
          date,
          title,
          description,
          documents: [],
        },
      ],
    }));
    setMonthlyUploadings((prev) => [...prev, { month, progress: false }]);

    setTitle("");
    setDescription("");
    setDate("");
  };

  // ─────────────────────────────────────────────
  // REMOVE ACTIVITY
  // ─────────────────────────────────────────────
  const removeActivity = (index: number) => {
    setReportForm((prev) => ({
      ...prev,
      participated_activities: prev.participated_activities.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  // ─────────────────────────────────────────────
  // ADD DOCUMENTS
  // ─────────────────────────────────────────────

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

  const uploadDocs = async (
    e: React.ChangeEvent<HTMLInputElement>,
    activityIndex: number,
  ) => {
    makeUploadProgress(activityIndex);

    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);

    makeUploadProgress(activityIndex, false);

    setReportForm((prev) => {
      const updated = [...prev.participated_activities];

      updated[activityIndex] = {
        ...updated[activityIndex],
        documents: [...updated[activityIndex].documents, ...urls],
      };

      return {
        ...prev,
        participated_activities: updated,
      };
    });
  };

  // ─────────────────────────────────────────────
  // REMOVE SINGLE DOCUMENT
  // ─────────────────────────────────────────────
  const removeDocument = (activityIndex: number, docIndex: number) => {
    setReportForm((prev) => {
      const updated = [...prev.participated_activities];

      updated[activityIndex] = {
        ...updated[activityIndex],
        documents: updated[activityIndex].documents.filter(
          (_, i) => i !== docIndex,
        ),
      };

      return {
        ...prev,
        participated_activities: updated,
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
        <Chip label="03" color="warning" />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={700}>
          Conduct & Participate in Rent.ph Activities
        </Typography>
      </Stack>

      <Typography sx={{ mt: 1, fontSize: { xs: 13, sm: 14 } }}>
        Minimum 3 activities per month required (Jan–Mar reporting period).
      </Typography>
      <Typography sx={{ fontSize: { xs: 12, sm: 13 } }} color="textSecondary">
        Note: Upload any proof of participation (e.g., clear photos,
        certificates or other relevant documents).
      </Typography>

      {/* FORM */}
      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: 2 }}>
        {/* MONTH SELECT */}
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

        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          fullWidth
        />

        <AppButton onClick={addActivity} variant="contained">
          Add
        </AppButton>
      </Stack>

      {/* GROUPED VIEW */}
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
                  No activities yet
                </Typography>
              )}

              <Stack spacing={2}>
                {items.map((act) => {
                  const activityIndex = data.findIndex(
                    (x) =>
                      x.month === act.month &&
                      x.title === act.title &&
                      x.date === act.date,
                  );

                  return (
                    <Paper
                      key={activityIndex}
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
                          <Typography fontWeight={600}>{act.title}</Typography>
                          <Typography variant="caption">{act.date}</Typography>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => removeActivity(activityIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* DESCRIPTION */}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {act.description}
                      </Typography>

                      {/* UPLOAD */}
                      <AppButton
                        component="label"
                        size="small"
                        sx={{ mt: 1 }}
                        startIcon={<AttachFile />}
                      >
                        Upload Documents
                        <input
                          hidden
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => uploadDocs(e, activityIndex)}
                        />
                      </AppButton>

                      {/* DOCUMENTS PREVIEW */}
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap" }}
                      >
                        {act.documents.map((doc, docIndex) => (
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
                              color="error"
                              onClick={() =>
                                removeDocument(activityIndex, docIndex)
                              }
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
                      {monthlyUploadings[activityIndex].progress && (
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
