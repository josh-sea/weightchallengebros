// New WeightTable Component
import React from "react";
import { Table, Segment, Label, Icon } from "semantic-ui-react";

const WeightTable = ({ weights, userEmail }) => {
  // Calculate cumulative weight loss based on the oldest weight in the dataset
  const oldestWeight = weights.length > 0 ? weights[weights.length - 1].weight : 0;

  return (
    <Segment basic className="scroll" style={{ maxHeight: "50vh", overflowY: "scroll" }}>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Weight</Table.HeaderCell>
            <Table.HeaderCell>Cumulative Weight Loss</Table.HeaderCell>
            <Table.HeaderCell>Trend</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {weights.map((weightEntry, index) => {
            const weightDifference = index === weights.length - 1 ? 0 : weights[index + 1].weight - weights[index].weight;
            const cumulativeLoss = (oldestWeight - weightEntry.weight).toFixed(1);

            return (
              <Table.Row key={index}>
                <Table.Cell>{weightEntry.date}</Table.Cell>
                <Table.Cell>
                  <Label
                    ribbon
                    color={
                      weightEntry.weight === Math.max(...weights.map((w) => w.weight))
                        ? "red"
                        : weightEntry.weight === Math.min(...weights.map((w) => w.weight))
                        ? "green"
                        : null
                    }
                  >
                    {weightEntry.weight.toFixed(1)}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  {cumulativeLoss} lbs
                </Table.Cell>
                <Table.Cell>
                  {weightDifference !== 0 && (
                    <Icon
                      name={weightDifference > 0 ? "arrow down" : "arrow up"}
                      color={weightDifference > 0 ? "green" : "red"}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default WeightTable;
