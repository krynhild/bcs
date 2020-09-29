import React from "react";

export const TabPanel = (props) => {
  const { children, activeTab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={activeTab !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {activeTab === index && (
        <div>{children}</div>
      )}
    </div>
  );
}
