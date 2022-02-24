import React from 'react';
import MaterialTable from 'material-table';

class Person extends React.Component {
  render() {
    const data = this.props.data;
    //inputs for Table
    const column = [
      { title: "First Name", field: "fname" },
      { title: "Last Name", field: "lname" },
      { title: "Surname", field: "sname" },
      { title: "Date of Birth", field: "dob" },
      { title: "User Id", field: "userId" },
      { title: "Phone No", field: "phoneNo" },
      { title: "Email", field: "email" },
      { title: "Country", field: "country" },
      { title: "State", field: "state" },
      { title: "City", field: "city" },
      { title: "Location", field: "loc" },
      { title: "Hobbies", field: "hobbies" },
      { title: "Anniversary", field: "anniversary" },
      { title: "FB", field: "fb" },
      { title: "LinkedIn", field: "linkedIn" },
      { title: "Insta", field: "insta" }

    ];
    const detailPanel = [
      {
        tooltip: 'Show Thinking',
        render: rowData => {
          return (
            <div
              style={{
                fontSize: 15,
                textAlign: 'center',
                color: 'black',
                backgroundColor: 'white',
              }}
            >
              <table className="dtlPanel">
                <tr>
                  <th width="30%">Subject</th>
                  <th>Message</th>
                </tr>

                {
                  rowData.thinking !== undefined ?
                    <tr>
                      <td>{rowData.thinking.sub}</td>
                      <td>{rowData.thinking.msg}</td>
                    </tr>
                    :
                    <p>No Data</p>
                }

              </table>
            </div>
          )
        },
      },
      {
        icon: 'account_circle',
        tooltip: 'Show Contacts',
        render: rowData => {
          return (
            <div
              style={{
                fontSize: 15,
                textAlign: 'center',
                color: 'black',
                backgroundColor: 'white',
              }} >
              <table className="dtlPanel">
                <tr>
                  <th width="40%">PK</th>
                  <th>SK</th>
                </tr>
                {
                  rowData.contacts !== undefined ?
                    rowData.contacts.map(e =>
                      <tr>
                        <td>{e.PK}</td>
                        <td>{e.SK}</td>
                      </tr>
                    ) :
                    <p>No Data</p>

                }
              </table>
            </div>
          )
        }
      }];

    return (
      <div className="matTable"  >
        <MaterialTable width="100%" columns={column} title="Person Data" data={data} detailPanel={detailPanel} />
      </div>
    );
  }
}

export default Person;