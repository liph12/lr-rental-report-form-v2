import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface UserData {
  id: number;
  name: string;
  email: string;
  team: string;
  team_id: number;
}

interface RentManager {
  name: string;
  certifiedAt: string;
  type: "Rent Manager" | "Rent Manager PRO";
}

interface Secretary {
  name: string;
  email: string;
}

interface officeSecretary {
  office_photos: string[];
  secretarial_documents: string[];
  address: string;
  secretaries: Secretary[];
}

export interface ParticipatedActivity {
  month: string;
  date: string;
  title: string;
  description: string;
  documents: string[];
}

export interface SocialMediaPresence {
  month: string;
  date: string;
  documents: string[];
}

interface ReportForm {
  rent_managers: RentManager[];
  office_secretary: officeSecretary;
  participated_activities: ParticipatedActivity[];
  social_media_presence: SocialMediaPresence[];
  rent_ph_account: string;
}

type AppContextType = {
  userData: UserData | null;
  reportForm: ReportForm;
  setReportForm: React.Dispatch<React.SetStateAction<ReportForm>>;
  isMobile: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultReportForm: ReportForm = {
  rent_managers: [],
  office_secretary: {
    office_photos: [],
    secretarial_documents: [],
    address: "",
    secretaries: [],
  },
  participated_activities: [],
  social_media_presence: [],
  rent_ph_account: "",
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reportForm, setReportForm] = useState<ReportForm>(defaultReportForm);

  useEffect(() => {
    const fetchUserDataAsync = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://leuteriorealty.com/api/agent/auth",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        const data = response.data.data;
        const _userData: UserData = {
          id: data.id,
          name: data.name,
          email: data.email,
          team: data.team.teamname,
          team_id: data.team.id,
        };

        setUserData(_userData);
      } catch (e) {
        // to do
      }
    };

    fetchUserDataAsync();
  }, []);

  return (
    <AppContext.Provider
      value={{ userData, reportForm, setReportForm, isMobile }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};
