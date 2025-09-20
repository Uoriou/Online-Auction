import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';
import React, { useEffect, useState } from 'react';

/*Deletes the expired items automatically  */