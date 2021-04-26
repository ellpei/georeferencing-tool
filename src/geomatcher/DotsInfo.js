import React from 'react';
import {Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import '../styles/image-dots.css';

export default function DotsInfo({dots, deleteDot, resetDots}) {
  return (
      <div className="dotsinfo">
        <div className="row justify-content-center">
            <Table hover size="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>x</th>
                    <th>y</th>
                    <th>long</th>
                    <th>lat</th>
                    <th>parent</th>
                    <th>parentType</th>
                    <th>note</th>
                    <th>delete</th>
                    </tr>
                </thead>
                <tbody>
                {dots.map((dot, i) => {
                    return (<tr key={i}>
                            <td>{i} </td>
                            <td>{dot.x}</td>
                            <td>{dot.y}</td>
                            <td>{dot.lng}</td>
                            <td>{dot.lat}</td>
                            <td>{JSON.stringify(dot.parent)}</td>
                            <td>{dot.parentType}</td>
                            <td>{dot.note}</td>
                            <td><Button variant='danger' onClick={() => deleteDot(i)}>×</Button></td>
                    </tr>);})}
                </tbody>
              </Table>
        </div>
        <Button variant='success' onClick={() => resetDots()}>Reset</Button>
      </div>
  );
}
