import React from "react";
import UserBooksList, {
  ReadingStatus,
} from "../../Components/UserBook/UserBooksList";
const ReaderReadingList: React.FC = () => (
  <UserBooksList
    readingStatus={ReadingStatus.Reading}
    title="Currently Reading"
  />
);

export default ReaderReadingList;
