import React from "react";
import { ReadingStatus } from "../../Models/ReadingStatus";
import UserBooksList from "../../Components/UserBook/UserBooksList";

const ReaderToReadList: React.FC = () => (
  <UserBooksList readingStatus={ReadingStatus.ToRead} title="To Read List" />
);

export default ReaderToReadList;
