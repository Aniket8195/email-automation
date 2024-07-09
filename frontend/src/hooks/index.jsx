import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const useUser = ({id}) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/user/details/${id}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        
        });
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  return { user, loading };
}

export const useUploadTemplate = () => {
  const [loading, setLoading] = useState(false);

  const uploadTemplate = async ({ name, label, subject, body }) => {
      setLoading(true);
      try {
          const jwt = localStorage.getItem("jwt");
          const response = await axios.post(
              `${BACKEND_URL}/user/addTemplate`,
              { name, label, subject, body },
              {
                  headers: {
                      Authorization: `Bearer ${jwt}`,
                  },
              }
          );
          setLoading(false);
          return response.data;
      } catch (error) {
          console.error("Error uploading template", error);
          setLoading(false);
          throw error;
      }
  };

  return { uploadTemplate, loading };
};

export const useFetchTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const jwt = localStorage.getItem("jwt"); 
        const response = await axios.get(`${BACKEND_URL}/user/getTemplates`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setTemplates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading };
};

export const useUploadSchedule = () => {
  const [loading1,setLoading]=useState(false);
  const uploadSchedule = async ({ templateId, recipient, subject, body, sendAt }) => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.post(
        `${BACKEND_URL}/user/scheduleMail`,
        { templateId, recipient, subject, body, sendAt },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error uploading schedule", error);
      setLoading(false);
      throw error;
    }
  };
  return { uploadSchedule, loading1 };
}
export const useFetchScheduledEmails = () => {
  const [scheduledEmails, setScheduledEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledEmails = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.get(`${BACKEND_URL}/user/getScheduledMails`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setScheduledEmails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scheduled emails", error);
        setLoading(false);
      }
    };

    fetchScheduledEmails();
  }, []);

  return { scheduledEmails, loading };
}

