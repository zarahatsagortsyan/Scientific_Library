import React from "react";
import UserBooksList, {
  ReadingStatus,
} from "../../Components/UserBook/UserBooksList";

const ReaderReadList: React.FC = () => (
  <UserBooksList readingStatus={ReadingStatus.Read} title="Completed" />
);

export default ReaderReadList;
