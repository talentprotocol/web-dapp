import React from "react";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import P2 from "src/components/design_system/typography/p2";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";

const ReferenceList = ({ users, mode }) => (
  <Table mode={mode}>
    <Table.Head>
      <Table.Th>
        <Caption bold text="Supporter" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Amount" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Last Buy" />
      </Table.Th>
    </Table.Head>
    <Table.Body>
      {users.map((user) => (
        <Table.Tr key={user.id}>
          <Table.Td>
            <div className="d-flex align-items-center">
              <TalentProfilePicture src={user.profilePictureUrl} height={24} />
              <P2 text={user.username} bold className="ml-2" />
              <P2
                text={`(${user.display_wallet_id})`}
                className="ml-2 wallet-id-text"
              />
            </div>
          </Table.Td>
          <Table.Td>
            <P2 text={user.amount} />
          </Table.Td>
          <Table.Td>
            <P2 text={user.last_buy_date} />
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Body>
  </Table>
);

export default ReferenceList;
