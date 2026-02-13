import React from "react";
import PendingApprovalScreen from "../components/PendingApprovalScreen";

function PendingApprovalDemo() {
  // Mock user data for testing
  const mockUserData = {
    firstname: "Jeffy",
    lastname: "Itaok",
    username: "ItaokJeffy",
    email: "itaokjeffy@gmail.com",
  };

  return <PendingApprovalScreen userData={mockUserData} />;
}

export default PendingApprovalDemo;
