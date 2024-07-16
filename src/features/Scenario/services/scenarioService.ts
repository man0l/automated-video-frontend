import axios from 'axios';
import { Scenario, CreateScenarioPayload, UpdateScenarioPayload } from '../Scenario.types';

const API_BASE_URL = '/api/scenarios'; // Base URL for the scenario API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL as string;
// Fetch all scenarios
export const getScenarios = async (): Promise<Scenario[]> => {
  const response = await axios.get<Scenario[]>(API_BASE_URL);
  return response.data;
};

// Fetch a single scenario by ID
export const getScenarioById = async (id: number): Promise<Scenario> => {
  const response = await axios.get<Scenario>(`${API_BASE_URL}/${id}`);
  return response.data;
};

// Create a new scenario
export const createScenario = async (scenario: CreateScenarioPayload): Promise<Scenario> => {
  const response = await axios.post<Scenario>(API_BASE_URL, scenario);
  return response.data;
};

// Update an existing scenario
export const updateScenario = async (id: number, scenario: UpdateScenarioPayload): Promise<Scenario> => {
  const response = await axios.put<Scenario>(`${API_BASE_URL}/${id}`, scenario);
  return response.data;
};

// Delete a scenario
export const deleteScenario = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
