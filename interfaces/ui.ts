export interface IAlertMessageState {
  alertMessage: string;
  displayAlert: boolean;
  severity: "warning" | "success" | "error";
}

export interface IErrorResponse {
  message: string
}