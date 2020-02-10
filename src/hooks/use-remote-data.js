import {useState, useEffect} from "react";

const useRemoteData = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url).then((res) => res.json()).then((remoteData) => {
      setData(remoteData);
      setLoading(false);
    }).catch((err) => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return {loading, data, error};
};

export {useRemoteData as default};
