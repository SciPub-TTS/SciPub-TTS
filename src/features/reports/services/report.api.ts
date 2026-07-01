import { http } from "@/services/http";
import type { ReportExportRequest } from "@/features/reports/types";

const REPORT_EXPORT_ENDPOINT = "/api/export/report";

function getFileName(contentDisposition: string | undefined, format: string) {
  const encodedName = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plainName = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1];

  if (encodedName) {
    try {
      return decodeURIComponent(encodedName);
    } catch {
      return encodedName;
    }
  }

  return (
    plainName ??
    `research-report-${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`
  );
}

export const reportApi = {
  async exportReport(payload: ReportExportRequest) {
    const response = await http.post<Blob>(REPORT_EXPORT_ENDPOINT, payload, {
      responseType: "blob",
    });

    return {
      file: response.data,
      fileName: getFileName(response.headers["content-disposition"], payload.format),
    };
  },
};
