import axios from "axios";
import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";

const app = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default app;
