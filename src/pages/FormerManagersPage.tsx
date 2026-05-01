import React from 'react';
import FormerLeadersPage from './FormerLeadersPage';
import { AppData } from '../types';

const FormerManagersPage = ({ data }: { data: AppData }) => (
  <FormerLeadersPage 
    data={data} 
    type="Manager" 
    title="Managers" 
    description="Dedicated stewards of the institution's resources and long-term organizational health."
  />
);

export default FormerManagersPage;
