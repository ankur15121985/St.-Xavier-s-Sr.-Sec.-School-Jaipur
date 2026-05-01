import React from 'react';
import FormerLeadersPage from './FormerLeadersPage';
import { AppData } from '../types';

const FormerPrincipalsPage = ({ data }: { data: AppData }) => (
  <FormerLeadersPage 
    data={data} 
    type="Principal" 
    title="Principals" 
    description="Visionary leaders who have steered our academic journey and nurtured countless students since 1941."
  />
);

export default FormerPrincipalsPage;
