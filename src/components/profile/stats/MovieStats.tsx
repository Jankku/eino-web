import { Card, CardContent, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { StatsStatusTable } from './StatsStatusTable';
import { BarChart } from './BarChart';
import { StatsItem } from './StatsItem';
import { StatusProgressBar } from './StatusProgressBar';
import { Profile } from '../../../data/profile/profile.types';
import { useState } from 'react';
import ItemListDialog from '../ItemListDialog';
import { getProgressValues } from '../../../utils/chartUtils';
import { useMovies } from '../../../data/movies/useMovies';
import { useToggle } from '@uidotdev/usehooks';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { formatWatchTime } from '../../../utils/profileUtil';

const statuses = ['completed', 'watching', 'on-hold', 'dropped', 'planned'];

type MovieStatsProps = {
  stats: Profile['stats']['movie'];
};

export function MovieStats({ stats }: MovieStatsProps) {
  const isMobile = useIsMobile();
  const [listDialogOpen, toggleListDialog] = useToggle(false);
  const [selectedScore, setSelectedScore] = useState<number>();
  const { data, isLoading } = useMovies({
    enabled: listDialogOpen && selectedScore !== undefined,
    status: 'all',
    filter: `score:=:${selectedScore}`,
  });

  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (isMobile ? score : `⭐${score}`));
  const scoreCounts = stats.score_distribution.map((item) => item.count);
  const progressValues = getProgressValues(stats.count);

  const onBarClick = (index: number) => {
    setSelectedScore(index + 1);
    toggleListDialog();
  };

  return (
    <>
      <Card component="section" variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 2,
            }}
          >
            <h2>Movie stats</h2>
            <Stack direction="column" sx={{ flexWrap: 'wrap', width: '100%', rowGap: 2 }}>
              <Stack direction="column" sx={{ flexWrap: 'wrap', width: '100%', rowGap: 1 }}>
                <Stack
                  component="dl"
                  direction="row"
                  sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'space-between', m: 0 }}
                >
                  <StatsItem title={'Watch time:'} text={formatWatchTime(stats.watch_time)} />
                  <StatsItem title={'Average score:'} text={stats.score_average} />
                </Stack>
                <Stack direction="column" sx={{ flexWrap: 'wrap', rowGap: 1, width: '100%' }}>
                  <StatusProgressBar data={progressValues} total={stats.count.all} />
                  <StatsStatusTable stats={stats} statuses={statuses} />
                </Stack>
              </Stack>
              <BarChart labels={labels} data={scoreCounts} onClick={onBarClick} />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ width: '100%', textAlign: 'center' }}
              >
                Select a bar to view movies with that score
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <ItemListDialog
        title={`Movies with score ${selectedScore}`}
        visible={listDialogOpen}
        closeDialog={toggleListDialog}
        isLoading={isLoading}
        items={data?.map((movie) => ({
          id: movie.movie_id,
          to: `/movies/${movie.movie_id}`,
          title: movie.title,
          detailText: movie.director,
          status: movie.status,
          score: movie.score,
          imageUrl: movie.image_url,
        }))}
      />
    </>
  );
}
