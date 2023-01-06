import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { LaunchData } from './types';
import LaunchList, { sortByNameOptions } from './LaunchList';

import { fetchPastLaunches } from './api';
import userEvent from '@testing-library/user-event';
jest.mock('./api');

const mockLaunches: LaunchData[] = [
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Crew Dragon"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-15T00:49:00.000Z",
    "mission_name": "Crew-1",
    "id": "107",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Satellite"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-01T00:00:00.000Z",
    "mission_name": "SXM-7",
    "id": "110",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Dragon 1.1"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-12-02T17:50:00.000Z",
    "mission_name": "CRS-21",
    "id": "112",
    "links": {
      "mission_patch_small": null
    }
  }
];

beforeEach(() => {
  (fetchPastLaunches as jest.Mock).mockResolvedValue(mockLaunches)
})

test('renders past launches', async () => {
  render(<LaunchList/>);

  const titleElement = screen.getByText("Past Launches");
  expect(titleElement).toBeInTheDocument();

  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchPastLaunches).toBeCalledTimes(1);
});

test('renders sort by name dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await (await screen.findByText('Mission Name (desc)'));
  expect(dropdownElement).toBeInTheDocument();
});

test('sort by dropdown dropdown contains mission name (ascending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Mission Name (asc)' }) as HTMLOptionElement;
  expect(option.value).toBe('mission_name-asc');
});

test('sort by dropdown dropdown contains mission name (descending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Mission Name (desc)' }) as HTMLOptionElement;
  expect(option.value).toBe('mission_name-desc');
});

test('changing sort by dropdown changes sort order', async () => {
  render(<LaunchList />);
  const dropdownElements = await screen.findAllByRole('combobox');

  act(() => {
    userEvent.selectOptions(dropdownElements[0], 'mission_name-asc');
  });

  expect(fetchPastLaunches).toBeCalledTimes(2);
  expect(fetchPastLaunches).toHaveBeenCalledWith(10, sortByNameOptions[0])
});

test('renders sort by name dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await (await screen.findByText('Launch Date (desc)'));
  expect(dropdownElement).toBeInTheDocument();
});

test('renders search input', async () => {
  render(<LaunchList/>);

  const searchInput = await screen.findByRole('textbox');
  expect(searchInput).toBeInTheDocument();
});

