import { useContext, useEffect, useState } from "react";
import { topRated } from "../../../remote/rating";
import { Sex, ratingMessage, ratingRecord } from "../../../types/Api";
import Spinner from "../../Spinner/Spinner";
import UserContext from "../../../utility/UserContext";
import GroupContext from "../../../utility/GroupContext";

function Results() {
  const { user } = useContext(UserContext);
  const { group } = useContext(GroupContext);

  const [boys, setBoys] = useState<ratingMessage>({
    message: "loading",
    success: false,
  });
  const [girls, setGirls] = useState<ratingMessage>({
    message: "loading",
    success: false,
  });
  const [unisex, setUnisex] = useState<ratingMessage>({
    message: "loading",
    success: false,
  });
  const [all, setAll] = useState<ratingMessage>({
    message: "loading",
    success: false,
  });

  const fetchData = async (
    sex: Sex,
    setStateMethod: React.Dispatch<React.SetStateAction<ratingMessage>>
  ) => {
    if (user.user_id === undefined || user.user_id <= 0 || !group?.group_id)
      return;
    setStateMethod(
      await topRated({
        user,
        group_id: group?.group_id,
        count: 5,
        sex,
      })
    );
  };

  useEffect(
    function () {
      fetchData(Sex.male, setBoys);
      fetchData(Sex.female, setGirls);
      fetchData(Sex.unisex, setUnisex);
      fetchData(Sex.all, setAll);
    },
    [user, group]
  );

  const dataMapper = (n: ratingRecord) => <li key={n.name_id}>{n.name}</li>;

  const boysClause =
    boys.success && boys.data ? (
      boys.data.map(dataMapper)
    ) : (
      <>
        <Spinner />
        <div>Boy Data not loaded</div>
      </>
    );
  const girlsClause =
    girls.success && girls.data ? (
      girls.data.map(dataMapper)
    ) : (
      <>
        <Spinner />
        <div>Girl Data not loaded</div>
      </>
    );
  const unisexClause =
    unisex.success && unisex.data ? (
      unisex.data.map(dataMapper)
    ) : (
      <>
        <Spinner />
        <div>Unisex Data not loaded</div>
      </>
    );
  const allClause =
    all.success && all.data ? (
      all.data.map(dataMapper)
    ) : (
      <>
        <Spinner />
        <div>Summary Data not loaded</div>
      </>
    );

  return (
    <section>
      <div id="results">
        <h2>Top Rated Names</h2>
        <div>
          <h3>Boys</h3>
          <ul>{boysClause}</ul>
        </div>
        <div>
          <h3>Girls</h3>
          <ul>{girlsClause}</ul>
        </div>
        <div>
          <h3>Unisex</h3>
          <ul>{unisexClause}</ul>
        </div>
        <div>
          <h3>All</h3>
          <ul>{allClause}</ul>
        </div>
      </div>
    </section>
  );
}

export default Results;
