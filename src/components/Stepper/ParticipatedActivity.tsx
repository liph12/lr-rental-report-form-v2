import { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Chip,
  Typography,
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
import { type ParticipatedActivity as ParticipatedActivityType } from "../../providers/AppProvider";

const MONTHS = ["January", "February", "March"];
const ACTIVITIES_PER_MONTH = 3; // default slots; user can add up to 5

// Default date per month — user can still change it via the date picker
const MONTH_DEFAULT_DATE: Record<string, string> = {
  January: "2026-01-01",
  February: "2026-02-01",
  March: "2026-03-01",
};

type MonthlyUploading = {
  month: string;
  progress: boolean;
};

export default function ParticipatedActivity({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  const data = reportForm.participated_activities;

  const [monthlyUploadings, setMonthlyUploadings] = useState<
    MonthlyUploading[]
  >([]);

  // ─────────────────────────────────────────────
  // INIT: pre-fill 3 blank slots per month
  // ─────────────────────────────────────────────
  useEffect(() => {
    const activities: ParticipatedActivityType[] = [];

    MONTHS.forEach((m) => {
      for (let i = 0; i < ACTIVITIES_PER_MONTH; i++) {
        activities.push({
          month: m,
          date: MONTH_DEFAULT_DATE[m] ?? "",
          title: "",
          description: "",
          documents: [],
        });
      }
    });

    setReportForm((prev) => ({
      ...prev,
      participated_activities: [...activities],
    }));

    setMonthlyUploadings(
      activities.map((a) => ({ month: a.month, progress: false })),
    );
  }, []);

  // ─────────────────────────────────────────────
  // UPDATE FIELD — updates a single activity's field in-place
  // ─────────────────────────────────────────────
  const updateField = (
    globalIndex: number,
    field: keyof Pick<
      ParticipatedActivityType,
      "date" | "title" | "description"
    >,
    value: string,
  ) => {
    setReportForm((prev) => {
      const updated = [...prev.participated_activities];
      updated[globalIndex] = { ...updated[globalIndex], [field]: value };
      return { ...prev, participated_activities: updated };
    });
  };

  // ─────────────────────────────────────────────
  // ADD ACTIVITY SLOT (up to 5 per month)
  // ─────────────────────────────────────────────
  const addActivitySlot = (month: string) => {
    const currentCount = data.filter((a) => a.month === month).length;
    if (currentCount >= 5) return; // max 5 per month

    const newActivity: ParticipatedActivityType = {
      month,
      date: MONTH_DEFAULT_DATE[month] ?? "",
      title: "",
      description: "",
      documents: [],
    };

    setReportForm((prev) => ({
      ...prev,
      participated_activities: [...prev.participated_activities, newActivity],
    }));
    setMonthlyUploadings((prev) => [...prev, { month, progress: false }]);
  };

  // ─────────────────────────────────────────────
  // REMOVE ACTIVITY
  // ─────────────────────────────────────────────
  const removeActivity = (globalIndex: number) => {
    setReportForm((prev) => ({
      ...prev,
      participated_activities: prev.participated_activities.filter(
        (_, i) => i !== globalIndex,
      ),
    }));
    setMonthlyUploadings((prev) => prev.filter((_, i) => i !== globalIndex));
  };

  // ─────────────────────────────────────────────
  // UPLOAD DOCUMENTS
  // ─────────────────────────────────────────────
  const makeUploadProgress = (globalIndex: number, progress = true) => {
    setMonthlyUploadings((prev) => {
      const updated = [...prev];
      updated[globalIndex] = { ...updated[globalIndex], progress };
      return updated;
    });
  };

  const uploadDocs = async (
    e: React.ChangeEvent<HTMLInputElement>,
    globalIndex: number,
  ) => {
    makeUploadProgress(globalIndex, true);
    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);
    makeUploadProgress(globalIndex, false);

    setReportForm((prev) => {
      const updated = [...prev.participated_activities];
      updated[globalIndex] = {
        ...updated[globalIndex],
        documents: [...updated[globalIndex].documents, ...urls],
      };
      return { ...prev, participated_activities: updated };
    });
  };

  // ─────────────────────────────────────────────
  // REMOVE SINGLE DOCUMENT
  // ─────────────────────────────────────────────
  const removeDocument = (globalIndex: number, docIndex: number) => {
    setReportForm((prev) => {
      const updated = [...prev.participated_activities];
      updated[globalIndex] = {
        ...updated[globalIndex],
        documents: updated[globalIndex].documents.filter(
          (_, i) => i !== docIndex,
        ),
      };
      return { ...prev, participated_activities: updated };
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
        Maximum 5 per month.
      </Typography>
      <Typography sx={{ fontSize: { xs: 12, sm: 13 } }} color="textSecondary">
        Note: Upload any proof of participation (e.g., clear photos,
        certificates or other relevant documents).
      </Typography>

      {/* GROUPED VIEW — one section per month */}
      <Stack spacing={4} sx={{ mt: 4 }}>
        {MONTHS.map((m) => {
          // All activities for this month, with their global index preserved
          const monthItems = data
            .map((a, globalIndex) => ({ activity: a, globalIndex }))
            .filter(({ activity }) => activity.month === m);

          const canAddMore = monthItems.length < 5;

          return (
            <Box key={m}>
              {/* MONTH HEADER */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography fontWeight={700}>{m}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {monthItems.length} / 5 activities
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {monthItems.map(({ activity: act, globalIndex }, slotIndex) => (
                  <Paper
                    key={globalIndex}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    {/* SLOT LABEL */}
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="text.secondary"
                      sx={{ mb: 1, display: "block" }}
                    >
                      Activity #{slotIndex + 1}
                    </Typography>

                    {/* FIELDS ROW */}
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      spacing={2}
                      alignItems={isMobile ? "stretch" : "flex-start"}
                    >
                      {/* DATE */}
                      <TextField
                        type="date"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        value={act.date}
                        onChange={(e) =>
                          updateField(globalIndex, "date", e.target.value)
                        }
                        size="small"
                        sx={{ minWidth: 150 }}
                      />

                      {/* TITLE */}
                      <TextField
                        label="Title"
                        value={act.title}
                        onChange={(e) =>
                          updateField(globalIndex, "title", e.target.value)
                        }
                        size="small"
                        fullWidth
                      />

                      {/* DESCRIPTION */}
                      <TextField
                        label="Description"
                        value={act.description}
                        onChange={(e) =>
                          updateField(
                            globalIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        size="small"
                        fullWidth
                        multiline
                        minRows={1}
                      />

                      {/* DELETE SLOT — only allow if more than minimum (3) */}
                      {monthItems.length > ACTIVITIES_PER_MONTH && (
                        <IconButton
                          color="error"
                          onClick={() => removeActivity(globalIndex)}
                          sx={{ alignSelf: "center", flexShrink: 0 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>

                    {/* UPLOAD DOCUMENTS */}
                    <AppButton
                      component="label"
                      size="small"
                      sx={{ mt: 1.5 }}
                      startIcon={<AttachFile />}
                    >
                      Upload Documents
                      <input
                        hidden
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => uploadDocs(e, globalIndex)}
                      />
                    </AppButton>

                    {/* UPLOADING INDICATOR */}
                    {monthlyUploadings[globalIndex]?.progress && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <CircularProgress size={18} />
                        <Typography variant="body2" color="warning.main">
                          Uploading documents…
                        </Typography>
                      </Box>
                    )}

                    {/* DOCUMENT PREVIEWS */}
                    {act.documents.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
                      >
                        {act.documents.map((doc, docIndex) => (
                          <Box
                            key={docIndex}
                            sx={{ position: "relative", flexShrink: 0 }}
                          >
                            <Box
                              component="img"
                              src={doc}
                              sx={{
                                width: 70,
                                height: 70,
                                borderRadius: 1,
                                objectFit: "cover",
                                border: "1px solid #ddd",
                                display: "block",
                              }}
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                removeDocument(globalIndex, docIndex)
                              }
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                bgcolor: "background.paper",
                                border: "1px solid #ddd",
                                p: "2px",
                                "&:hover": { bgcolor: "error.50" },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                ))}
              </Stack>

              {/* ADD SLOT BUTTON */}
              {canAddMore && (
                <AppButton
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1.5 }}
                  onClick={() => addActivitySlot(m)}
                >
                  + Add Activity for {m}
                </AppButton>
              )}
            </Box>
          );
        })}
      </Stack>

      {/* VALIDATION ERRORS */}
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
