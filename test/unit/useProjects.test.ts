import { describe, expect, it } from 'vitest';
import { useProjects } from '../../app/composables/useProjects';

describe('useProjects', () => {
  it('exposes a non-empty list of complete projects', () => {
    const { projects } = useProjects();

    expect(projects.length).toBeGreaterThan(0);
    expect(projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
        }),
      ]),
    );
  });

  it('finds a project by id and returns undefined for an unknown id', () => {
    const { getProject } = useProjects();

    expect(getProject('ege-kritsky')?.title).toBe('ЕГЭ / Крицкий');
    expect(getProject('missing-project')).toBeUndefined();
  });
});
