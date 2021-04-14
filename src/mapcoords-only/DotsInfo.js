import React from 'react';
import {Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

export default function DotsInfo({
    dots, deleteDot }) {
  return (
    <Table hover size="sm">
        <thead>
            <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>shortName</th>
            <th>areaId</th>
            <th>x</th>
            <th>y</th>
            <th>delete</th>
            </tr>
        </thead>
        <tbody>
        {dots.map((dot, i) => {
            return (<tr key={i}>
                    <td>{i} </td>
                    <td>{dot.id}</td>
                    <td>{dot.name}</td>
                    <td>{dot.shortName}</td>
                    <td>{dot.areaId}</td>
                    <td>{dot.x}</td>
                    <td>{dot.y}</td>
                    <td><Button variant='danger' onClick={() => deleteDot(i)}>×</Button></td>
            </tr>);})}
        </tbody>
      </Table>
  );
}
