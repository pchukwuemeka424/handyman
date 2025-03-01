import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AgentUser() {
  const [agents, setAgents] = useState([]); // Store fetched agents
  const [selectedAgentId, setSelectedAgentId] = useState(""); // Track selected agent ID

  useEffect(() => {
    const fetchAgents = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.from("agents").select("*");

      if (error) {
        console.error("Error fetching agents:", error);
        return;
      }

      setAgents(data);
    };

    fetchAgents();
  }, []);

  return (
    <div>
      <select
        className="w-full py-3 border border-gray-300 rounded-md"
        name="agentId"
        value={selectedAgentId}
        onChange={(e) => setSelectedAgentId(e.target.value)}
        required
      >
        <option value="">Select Agent</option>
        {agents.map((agent) => (
          <option className="w-full" key={agent.id} value={agent.agentId}>
            {agent.agentId} - {agent.fname.toUpperCase()} {agent.lname.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
