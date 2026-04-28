import { useEffect, useState } from "react";
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
import { type SocialMediaPresence as SocialMediaPresenceType } from "../../providers/AppProvider";

const MONTHS = ["January", "February", "March"];
const ENTRIES_PER_MONTH = 5; // minimum required; user can add up to 10

const MONTH_DEFAULT_DATE: Record<string, string> = {
  January: "2026-01-01",
  February: "2026-02-01",
  March: "2026-03-01",
};

type MonthlyUploading = {
  month: string;
  progress: boolean;
};

export default function SocialMediaPresence({ errors }: { errors: string[] }) {
  const { reportForm, setReportForm, isMobile } = useAppContext();

  const data = reportForm.social_media_presence;

  const [monthlyUploadings, setMonthlyUploadings] = useState<
    MonthlyUploading[]
  >([]);

  // ─────────────────────────────────────────────
  // INIT: pre-fill 5 blank slots per month
  // ─────────────────────────────────────────────
  useEffect(() => {
    const entries: SocialMediaPresenceType[] = [];

    MONTHS.forEach((m) => {
      for (let i = 0; i < ENTRIES_PER_MONTH; i++) {
        entries.push({
          month: m,
          date: MONTH_DEFAULT_DATE[m] ?? "",
          documents: [],
        });
      }
    });

    setReportForm((prev) => ({
      ...prev,
      social_media_presence: [...entries],
    }));

    setMonthlyUploadings(
      entries.map((e) => ({ month: e.month, progress: false })),
    );
  }, []);

  // ─────────────────────────────────────────────
  // UPDATE DATE — updates only the targeted entry
  // ─────────────────────────────────────────────
  const updateDate = (globalIndex: number, value: string) => {
    setReportForm((prev) => {
      const updated = [...prev.social_media_presence];
      updated[globalIndex] = { ...updated[globalIndex], date: value };
      return { ...prev, social_media_presence: updated };
    });
  };

  // ─────────────────────────────────────────────
  // ADD ENTRY SLOT (up to 10 per month)
  // ─────────────────────────────────────────────
  const addEntrySlot = (month: string) => {
    const currentCount = data.filter((e) => e.month === month).length;
    if (currentCount >= 10) return;

    setReportForm((prev) => ({
      ...prev,
      social_media_presence: [
        ...prev.social_media_presence,
        { month, date: MONTH_DEFAULT_DATE[month] ?? "", documents: [] },
      ],
    }));
    setMonthlyUploadings((prev) => [...prev, { month, progress: false }]);
  };

  // ─────────────────────────────────────────────
  // REMOVE ENTRY
  // ─────────────────────────────────────────────
  const removeEntry = (globalIndex: number) => {
    setReportForm((prev) => ({
      ...prev,
      social_media_presence: prev.social_media_presence.filter(
        (_, i) => i !== globalIndex,
      ),
    }));
    setMonthlyUploadings((prev) => prev.filter((_, i) => i !== globalIndex));
  };

  // ─────────────────────────────────────────────
  // UPLOAD PROGRESS HELPER
  // ─────────────────────────────────────────────
  const makeUploadProgress = (globalIndex: number, progress = true) => {
    setMonthlyUploadings((prev) => {
      const updated = [...prev];
      updated[globalIndex] = { ...updated[globalIndex], progress };
      return updated;
    });
  };

  // ─────────────────────────────────────────────
  // UPLOAD DOCUMENTS
  // ─────────────────────────────────────────────
  const uploadDocs = async (
    e: React.ChangeEvent<HTMLInputElement>,
    globalIndex: number,
  ) => {
    makeUploadProgress(globalIndex, true);
    const files = Array.from(e.target.files || []);
    const urls = await useUploadFiles(files);
    makeUploadProgress(globalIndex, false);

    setReportForm((prev) => {
      const updated = [...prev.social_media_presence];
      updated[globalIndex] = {
        ...updated[globalIndex],
        documents: [...updated[globalIndex].documents, ...urls],
      };
      return { ...prev, social_media_presence: updated };
    });
  };

  // ─────────────────────────────────────────────
  // REMOVE DOCUMENT
  // ─────────────────────────────────────────────
  const removeDocument = (globalIndex: number, docIndex: number) => {
    setReportForm((prev) => {
      const updated = [...prev.social_media_presence];
      updated[globalIndex] = {
        ...updated[globalIndex],
        documents: updated[globalIndex].documents.filter(
          (_, i) => i !== docIndex,
        ),
      };
      return { ...prev, social_media_presence: updated };
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

      {/* GROUPED MONTHS */}
      <Stack spacing={4} sx={{ mt: 4 }}>
        {MONTHS.map((m) => {
          const monthItems = data
            .map((e, globalIndex) => ({ entry: e, globalIndex }))
            .filter(({ entry }) => entry.month === m);

          const canAddMore = monthItems.length < 10;

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
                  {monthItems.length} / 10 entries
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {monthItems.map(({ entry, globalIndex }, slotIndex) => (
                  <Paper
                    key={globalIndex}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    {/* SLOT HEADER */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={1.5}
                        alignItems={isMobile ? "stretch" : "center"}
                        flex={1}
                        mr={1}
                      >
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color="text.secondary"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Activity #{slotIndex + 1}
                        </Typography>

                        {/* DATE — controlled, default pre-filled */}
                        <TextField
                          type="date"
                          label="Date of Posting"
                          InputLabelProps={{ shrink: true }}
                          value={entry.date}
                          onChange={(e) =>
                            updateDate(globalIndex, e.target.value)
                          }
                          size="small"
                          sx={{ minWidth: 170 }}
                        />
                      </Stack>

                      {/* DELETE — only if above minimum */}
                      {monthItems.length > ENTRIES_PER_MONTH && (
                        <IconButton
                          color="error"
                          onClick={() => removeEntry(globalIndex)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>

                    {/* UPLOAD */}
                    <AppButton
                      component="label"
                      size="small"
                      sx={{ mt: 1.5 }}
                      startIcon={<AttachFile />}
                    >
                      Upload Proof
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
                    {entry.documents.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
                      >
                        {entry.documents.map((doc, docIndex) => (
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
                  onClick={() => addEntrySlot(m)}
                >
                  + Add Entry for {m}
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
