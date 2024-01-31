import React, { useState, useEffect } from "react";
import {
  Container,
  Label,
  Segment,
  SegmentGroup,
  Table,
  Accordion,
  Icon,
} from "semantic-ui-react";
import { auth, database } from "../admin/auth";
import WeightSubmission from "./submit";
import { formatDate } from "../admin/helpers";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import UserWeightChart from "./weightChart";
import "../App.css";
import LogoutButton from "../admin/logout";

const Home = () => {
  const [weights, setWeights] = useState([]);
  const [maxWeight, setMaxWeight] = useState(0);
  const [minWeight, setMinWeight] = useState(300);
  const [weightData, setWeightData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1); // For Accordion

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const weightsRef = ref(database, `users/${user.uid}/weights`);
        const unsubscribeData = onValue(weightsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            //convert object to array with entries, sort by timestamp, then map to values
            const formattedData = Object.entries(data)
              .sort(([a], [b]) => b - a)
              .map(([key, value]) => {
                return {
                  date: formatDate(key),
                  weight: value,
                };
              });
            setWeights(formattedData);
            const wData = [...formattedData].sort(function (a, b) {
              return b.weight - a.weight;
            });
            setMaxWeight(wData[0].weight);
            setMinWeight(wData[wData.length - 1].weight);
          }
        });

        // Detach the data listener when the component unmounts
        return () => unsubscribeData();
      }
    });

    // Detach the auth listener when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const userRef = ref(database, `users`);
    // Attach a listener to the Firebase data
    const unsubscribeUserData = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
          if (Object.keys(data).length !== 0) {
            const weights = Object.values(data).map(u => {
              return {name: u.name, weights: u.weights}
            })
            setWeightData(weights)
          }
    }, (error) => {
        console.error("Error fetching users data:", error);
    });

    // Detach the data listener when the component unmounts
    return () => unsubscribeUserData();
}, []);

const handleClick = (e, titleProps) => {
  const { index } = titleProps;
  const newIndex = activeIndex === index ? -1 : index;
  setActiveIndex(newIndex);
};

return (
  <Container>
    <Segment basic padded clearing>
      <LogoutButton />
    </Segment>

    <SegmentGroup vertical="true">
      <Segment basic>
        <WeightSubmission />
      </Segment>

      <Accordion fluid styled style={{ padding: 0 }}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
          <Icon name='dropdown' />
          Weight Table
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Segment basic className="scroll" style={{ maxHeight: "50vh", overflowY: "scroll" }}>
            <Table celled style={{ maxHeight: "40vh" }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Weight</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {weights.map((weightEntry, index) => {
                if (weightEntry.weight === maxWeight) {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{weightEntry.date}</Table.Cell>
                      <Table.Cell>
                        <Label ribbon color="red">
                          {weightEntry.weight}
                        </Label>
                      </Table.Cell>
                    </Table.Row>
                  );
                } else if (weightEntry.weight === minWeight) {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{weightEntry.date}</Table.Cell>
                      <Table.Cell>
                        <Label ribbon color="green">
                          {weightEntry.weight}
                        </Label>
                      </Table.Cell>
                    </Table.Row>
                  );
                } else {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>{weightEntry.date}</Table.Cell>
                      <Table.Cell>{weightEntry.weight}</Table.Cell>
                    </Table.Row>
                  );
                }
              })}
            </Table.Body>
            </Table>
          </Segment>
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
          <Icon name='dropdown' />
          Weight Chart
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1} style={{ padding: "0,2,0,2"}}>
          <Segment basic style={{ padding: 0 }}>
            {weightData.length !== 0 && <UserWeightChart data={weightData} />}
          </Segment>
        </Accordion.Content>
      </Accordion>
    </SegmentGroup>
  </Container>
);
};

export default Home;
