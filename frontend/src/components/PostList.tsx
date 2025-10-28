import { Button, Input, makeStyles, Title3 } from '@fluentui/react-components';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';
import type { Post as PostData } from '../api/utils';
import { PostListContext, type PostType } from '../contexts/PostListContext';
import { UserContext } from '../contexts/UserContext';
import { Post } from './Post';

const useStyles = makeStyles({
  container: {
    margin: '20px',
  },
  header: {
    margin: '10px',
    padding: '10px',
    width: '720px',
  },
  postListContainer: {
    margin: '20px',
  },
  postList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: '10px',
  },
  searchInput: {
    marginTop: '12px',
    width: '100%',
  },
  paginationContainer: {
    alignItems: 'center',
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    margin: '20px',
    padding: '10px',
  },
  pageInfo: {
    fontSize: '14px',
    minWidth: '100px',
    textAlign: 'center',
  },
});

const PaginationButtons = ({
  currentPage,
  hasNextPage,
  onPrevious,
  onNext,
  styles,
}: {
  currentPage: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  styles: ReturnType<typeof useStyles>;
}) => {
  return (
    <div className={styles.paginationContainer}>
      <Button
        appearance='secondary'
        icon={<ChevronLeft />}
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        前のページ
      </Button>
      <div className={styles.pageInfo}>ページ{currentPage}</div>
      <Button
        appearance='secondary'
        icon={<ChevronRight />}
        iconPosition='after'
        disabled={!hasNextPage}
        onClick={onNext}
      >
        次のページ
      </Button>
    </div>
  );
};

export const PostList = () => {
  const POSTS_PER_PAGE = 10;
  const AUTO_RELOAD_SECONDS = 30;

  const styles = useStyles();

  const { postList, setPostList } = useContext(PostListContext);
  const { userInfo } = useContext(UserContext);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchPostList = async (
    pageNumber: number = currentPageNumber,
    keyword: string = searchKeyword,
  ) => {
    if (!userInfo) return;

    const offset: number = (pageNumber - 1) * POSTS_PER_PAGE;

    const fetchPostsResult = await fetchPosts(userInfo.token, {
      offset,
      limit: POSTS_PER_PAGE,
      query: keyword,
    });

    if (!fetchPostsResult.success) {
      console.error('Failed to fetch posts:', fetchPostsResult.error);
      return;
    }

    if (!fetchPostsResult.data) {
      console.error('data is falsy');
      return;
    }

    setPostList(
      fetchPostsResult.data.map(
        (post: PostData): PostType => ({
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: {
            id: post.user.id,
            username: post.user.username,
          },
        }),
      ),
    );

    setHasNextPage(fetchPostsResult.data.length === POSTS_PER_PAGE);
  };

  const handlePreviousPage = () => {
    if (currentPageNumber > 1) {
      const newPageNumber = currentPageNumber - 1;
      setCurrentPageNumber(newPageNumber);
      fetchPostList(newPageNumber);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      const newPageNumber = currentPageNumber + 1;
      setCurrentPageNumber(newPageNumber);
      fetchPostList(newPageNumber);
    }
  };

  useEffect(() => {
    fetchPostList(1);
  }, []);

  useEffect(() => {
    const intervalId: number = setInterval(() => {
      fetchPostList(currentPageNumber, searchKeyword);
    }, AUTO_RELOAD_SECONDS * 1000);

    return () => clearInterval(intervalId);
  }, [currentPageNumber, searchKeyword]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title3>PostList</Title3>
        <Input
          className={styles.searchInput}
          value={searchKeyword}
          onChange={(e) => {
            const newKeyword = e.target.value;
            setSearchKeyword(newKeyword);
            setCurrentPageNumber(1);
            fetchPostList(1, newKeyword);
          }}
          placeholder='検索キーワードを入力'
        />
      </div>

      <div className={styles.header}>
        <Button
          onClick={() => fetchPostList(currentPageNumber)}
          icon={<RotateCcw />}
        >
          リロード
        </Button>
      </div>

      <PaginationButtons
        currentPage={currentPageNumber}
        hasNextPage={hasNextPage}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
        styles={styles}
      />

      <div className={styles.postListContainer}>
        <div className={styles.postList}>
          {postList.map((p) => (
            <Post key={p.id} post={p} />
          ))}
        </div>
      </div>

      <PaginationButtons
        currentPage={currentPageNumber}
        hasNextPage={hasNextPage}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
        styles={styles}
      />
    </div>
  );
};
