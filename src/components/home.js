import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  SegmentGroup,
  Accordion,
  Icon,
} from "semantic-ui-react";
import { auth, database } from "../admin/auth";
import WeightSubmission from "./submit";
import { formatDate } from "../admin/helpers";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import UserWeightChart from "./weightChart";
import LogoutButton from "../admin/logout";
import GoalSubmission from "./submitGoal";
import WeightTable from "./weightTable";

const Home = ({userEmail}) => {
  const [weights, setWeights] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1); // For Accordion
  const [goal, setGoal] = useState();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const weightsRef = ref(database, `users/${user.uid}/weights`);
        const goalRef = ref(database, `users/${user.uid}/goal`);

        const unsubscribeWeights = onValue(weightsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const formattedData = Object.entries(data)
              .sort(([a], [b]) => b - a)
              .map(([key, value]) => ({ date: formatDate(key), weight: value }));
            setWeights(formattedData);
          }
        });

        const unsubscribeGoal = onValue(goalRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setGoal(data);
          }
        });

        return () => {
          unsubscribeWeights();
          unsubscribeGoal();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const userRef = ref(database, `users`);
    const unsubscribeUserData = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Object.keys(data).length !== 0) {
        const weights = Object.values(data).map((u) => ({
          name: u.name,
          weights: u.weights,
          goal: u.goal,
          email: u.email
        }));
        setWeightData(weights);
      }
    });

    return () => unsubscribeUserData();
  }, []);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Container>
      <Segment basic padded clearing>
        <LogoutButton />
      </Segment>
      <SegmentGroup vertical raised>
        <SegmentGroup horizontal>
          <Segment>
            <WeightSubmission />
          </Segment>
          <Segment>
            <GoalSubmission />
          </Segment>
        </SegmentGroup>

        <Accordion fluid styled>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            Weight Table
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <WeightTable weights={weights} userEmail={userEmail}/>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            Weight Chart
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <Segment basic>
              {weightData.length !== 0 && <UserWeightChart data={weightData} goal={goal} userEmail={userEmail}/>}
            </Segment>
          </Accordion.Content>
        </Accordion>
      </SegmentGroup>
    </Container>
  );
};

export default Home;
