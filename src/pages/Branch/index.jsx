import React from 'react';
import PageWrap from '../page-wrap';
import PageContent from '../page-content';
import Content from './content';

const BranchPage = () => {
  const userData = JSON.parse(sessionStorage.getItem('user')) || {};

  const companyData = userData.company || {};

  return (
    <PageWrap>
      <PageContent>
        <Content user={userData} company={companyData} />
      </PageContent>
    </PageWrap>
  );
};

export default BranchPage;
