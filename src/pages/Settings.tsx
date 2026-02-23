import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Settings() {
  return (
    <Row>
      <Heading as="h1">Update application settings</Heading>
      {/* Constrain width to prevent form from looking too stretched on large screens */}
      <div style={{ maxWidth: "80rem" }}>
        <UpdateSettingsForm />
      </div>
    </Row>
  );
}

export default Settings;
