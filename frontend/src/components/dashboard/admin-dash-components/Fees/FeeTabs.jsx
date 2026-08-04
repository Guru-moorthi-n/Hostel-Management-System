function FeeTabs({
  selectedTab,
  setSelectedTab,
}) {
  const tabs = ["Pending", "Partial", "Paid", "All"];

  return (
    <div className="fee-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={selectedTab === tab ? "fee-tab active" : "fee-tab"}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default FeeTabs;
