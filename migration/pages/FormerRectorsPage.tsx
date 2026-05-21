import React from 'react';
import FormerLeadersPage from './FormerLeadersPage';
import { AppData } from '../types';

const FormerRectorsPage = ({ data }: { data: AppData }) => (
  <FormerLeadersPage 
    data={data} 
    type="Rector" 
    title="Rectors" 
    description="The spiritual and administrative guides who have shaped the mission of St. Xavier's through the decades."
  />
);

export default FormerRectorsPage;
