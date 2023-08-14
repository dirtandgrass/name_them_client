import React, { useEffect, useState } from "react";

import { NameType } from "../RandomNameList/RandomNameList";

import localFetch from "../../../../utility/LocalFetch";
import { SourceList } from "../../../../types/Source";
// import "./NameSource.css";

function NameSource({ name }: { name: NameType }) {
  const [loading, setLoading] = useState<boolean>(true);

  const [nameSources, setNameSources] = useState<SourceList>();

  const fetchSources = async () => {
    setLoading(true);
    try {
      console.log("name sources id", name.name_id);
      const response: any = await localFetch({
        path: `source/?name_id=${name.name_id}`,
      });
      const data = (response as SourceList) || undefined;
      // console.log("name source data", data);
      if (data) setNameSources(data); // Set the fetched data in the state
      else {
        setNameSources({ count: 0, data: [] });
      }
    } catch (error: unknown) {
      console.error(error);
      setNameSources({ count: 0, data: [] });
    } finally {
      setLoading(false); // Set loading state to false once the fetch is done
    }
  };

  // onMount
  useEffect(() => {
    // Function to fetch data from the API
    fetchSources(); // Call the fetch function when the component mounts
  }, []);

  if (loading) {
    return <div className="name-source">Loading...</div>;
  }

  if (!nameSources || nameSources.data.length === 0) {
    return <div className="name-source">No sources</div>;
  }

  return (
    <div className="name-source">
      {nameSources.data.map((source) => (
        <div key={source.source_id}>
          <div>
            <a href={source.url} target="_blank">
              {source.name}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NameSource;
