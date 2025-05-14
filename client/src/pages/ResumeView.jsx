import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { Document, Page } from "react-pdf";

// Sample test URL for debugging
const TEST_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf ";

function ResumeView() {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const userId = localStorage.getItem("userId"); // Make sure this exists

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        if (!userId) {
          setError("User ID not found.");
          return;
        }

        const url = `http://localhost:4000/resume/${userId}`;
        setResumeUrl(url);
      } catch (err) {
        setError("Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumeUrl();
  }, [userId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Loading resume...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setResumeUrl(TEST_PDF_URL)}
          sx={{ mt: 2 }}
        >
          Try Sample PDF
        </Button>
      </Box>
    );
  }

  if (!resumeUrl) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>No resume found. Please upload one in Settings.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Resume
      </Typography>

      <Paper elevation={3} sx={{ padding: 2, minHeight: "80vh" }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={handleDownload}>
            Download Resume
          </Button>
          <Typography>PDF Viewer</Typography>
        </Box>

        <Document
          file={{
            url: resumeUrl,
            httpHeaders: {
              Accept: "application/pdf",
              "Cache-Control": "no-cache",
            },
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) =>
            console.error("PDF Load Error:", err)
          }
          onError={(err) => {
            console.error("react-pdf Error:", err);
            setError("Failed to load PDF.");
          }}
          loading={
            <Box sx={{ textAlign: "center", my: 4 }}>
              <CircularProgress />
              <Typography>Loading PDF...</Typography>
            </Box>
          }
        >
          {numPages ? (
            Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                size="A4"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={window.innerWidth * 0.9}
                style={{ margin: "auto", marginBottom: "10px" }}
              />
            ))
          ) : (
            <Typography>No pages found</Typography>
          )}
        </Document>
      </Paper>
    </Box>
  );
}

export default ResumeView;